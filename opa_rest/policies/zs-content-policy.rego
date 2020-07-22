package zscontent.policy

import data.zscontent.acl

import input

default allow = false
default user_is_admin = false

allow {
        user_is_admin
}

user_is_admin {
 	input.role == "admin"
}

get_resource_mongo_query = mongoQuery {
    mongoQuery := input["external"]["role_based_resource"][input.role][input.resource]["mongoQuery"]
}